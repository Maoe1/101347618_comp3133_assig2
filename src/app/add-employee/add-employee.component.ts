import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';



const EMPLOYEES_QUERY = gql`
  query EmployeesQuery {
    employees {
      id
      first_name
      last_name
      email
      gender
      salary
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation AddEmployee($first_name: String!, $last_name: String!, $email: String!, $gender: String!, $salary: Float!) {
    addEmployee(first_name: $first_name, last_name: $last_name, email: $email, gender: $gender, salary: $salary) {
      success
      message
      employee {
        id
        first_name
        last_name
        email
        gender
        salary
      }
    }
  }
`;

export interface Employee {
  id: number;
  name: string;
  position: string;
  salary: number;
}

export interface EmployeesQueryResponse {
  employees: Employee[];
}

interface AddEmployeeResponse {
  addEmployee: {
    success: boolean;
    message: string;
    employee: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      gender: string;
      salary: number;
    } | null;
  }
}


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  gender: string = '';
  salary: number = 0;
  errorMessage: string = '';
  employees: Employee[] = [];

  constructor(private apollo: Apollo, private router: Router) {}

  

  addEmployee(event: Event): void {
    this.apollo.mutate<AddEmployeeResponse>({
      mutation: ADD_EMPLOYEE,
      variables: {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        gender: this.gender,
        salary: this.salary
      },
      refetchQueries: [{
        query: EMPLOYEES_QUERY
      }]
    }).subscribe(result => {
      console.log('Add Employee:', result);
      const response = result?.data?.addEmployee;
      if (response && !response.success) {
        console.error(response.message);
        this.errorMessage = response.message;
      } else {
        this.apollo.query<EmployeesQueryResponse>({
          query: EMPLOYEES_QUERY
        }).subscribe(({ data }) => {
          const employees: Employee[] = data.employees;
          this.router.navigate(['/employees'], { state: { employees } });
        });
      }
    }, error => {
      console.error('Error adding employee:', error);
    });
  }

  
}
