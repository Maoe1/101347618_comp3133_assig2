import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';


export class Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  salary: number;

  constructor(id: string, first_name: string, last_name: string, email: string, gender: string, salary: number) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.gender = gender;
    this.salary = salary;
  }
}
const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
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

const SEARCH_EMPLOYEE = gql`
  query searchEmployee($id: ID!) {
    searchEmployee(id: $id) {
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
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent implements OnInit {
  employee: Employee = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    salary: 0
  };

  constructor(private route: ActivatedRoute, private apollo: Apollo) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.apollo.query<{ searchEmployee: { employee: Employee } }>({
      query: SEARCH_EMPLOYEE,
      variables: { id }
    }).subscribe(result => {
      this.employee = result.data.searchEmployee.employee;
    });
  }

  updateEmployee(): void {
    const id = this.employee.id;
    const input = {
      first_name: this.employee.first_name,
      last_name: this.employee.last_name,
      email: this.employee.email,
      gender: this.employee.gender,
      salary: this.employee.salary
    };

    this.apollo.mutate<{ updateEmployee: { employee?: Employee } }>({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, input }
    }).subscribe(result => {
      const updatedEmployee = result.data?.updateEmployee?.employee;
      if (updatedEmployee) {
        this.employee = { ...this.employee, ...updatedEmployee };
      }
    });
  }
}
