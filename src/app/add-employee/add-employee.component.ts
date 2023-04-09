import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

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

  constructor(private apollo: Apollo) {}

  addEmployee(event: Event): void {
    this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        gender: this.gender,
        salary: this.salary
      }
    }).subscribe(result => {
      console.log('Add employee result:', result);
    }, error => {
      console.error('Add employee error:', error);
    });
  }

  
}
