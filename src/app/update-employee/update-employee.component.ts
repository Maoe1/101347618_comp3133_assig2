import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
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

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  salary: number;
}

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css'],
})
export class UpdateEmployeeComponent implements OnInit {
  employee: Employee = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    salary: 0,
  };

  constructor(
    private apollo: Apollo,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the employee ID from the route params and fetch the corresponding employee data
    const id = this.route.snapshot.paramMap.get('id');
    this.apollo
      .query<{ employee: Employee }>({
        query: gql`
          query GetEmployee($id: ID!) {
            employee(id: $id) {
              id
              first_name
              last_name
              email
              gender
              salary
            }
          }
        `,
        variables: { id },
      })
      .subscribe((result) => {
        this.employee = result.data.employee;
      });
  }

  updateEmployee(event: Event): void {
    this.apollo
      .mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: {
          id: this.employee.id,
          input: {
            first_name: this.employee.first_name,
            last_name: this.employee.last_name,
            email: this.employee.email,
            gender: this.employee.gender,
            salary: this.employee.salary,
          },
        },
      })
      .subscribe(
        (result) => {
          console.log('Update employee result:', result);
          this.router.navigate(['/employees']);
        },
        (error) => {
          console.error('Update employee error:', error);
        }
      );
  }
}
