import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  salary: number;
}

interface QueryResponse {
  employees: Employee[];
}

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

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
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

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
  
})


export class EmployeesComponent {
  employees: Employee[] = [];

  constructor(
    private apollo: Apollo,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  
  goToAddEmployee(): void {
    this.router.navigate(['/add-employee'], { relativeTo: this.route });
 }

 updateEmployee(employeeId: number) {
  this.router.navigate(['/update-employee', employeeId]);
}

deleteEmployee(id: string): void {
  this.apollo.mutate({
    mutation: DELETE_EMPLOYEE,
    variables: {
      id
    }
  }).subscribe(result => {
    console.log('Delete employee result:', result);
    // Remove the deleted employee from the employees array
    this.employees = this.employees.filter(employee => employee.id !== id);
  }, error => {
    console.error('Delete employee error:', error);
  });
}


  ngOnInit(): void {
    this.apollo
      .query<QueryResponse>({
        query: EMPLOYEES_QUERY
      })
      .subscribe(({ data }) => {
        this.employees = data.employees;
      });
  }
}
