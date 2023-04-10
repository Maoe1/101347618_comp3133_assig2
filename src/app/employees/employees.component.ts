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
  console.log(id);
  this.apollo.mutate({
    mutation: DELETE_EMPLOYEE,
    variables: {
      id
    },
    refetchQueries: [{
      query: EMPLOYEES_QUERY
    }]
  }).subscribe(result => {
    console.log('Delete employee response:', result);
    this.employees = this.employees.filter(employee => employee.id !== id);
  }, error => {
    console.error('Delete employee error:', error);
  });
}
ngOnInit(): void {
  this.route.queryParams.subscribe(() => {
    this.fetchEmployees();
  });
}

fetchEmployees(): void {
  this.apollo
    .query<QueryResponse>({
      query: EMPLOYEES_QUERY,
    })
    .subscribe(({ data }) => {
      this.employees = data.employees;
    });
}

refresh(): void {
  this.apollo.client.resetStore().then(() => {
    this.fetchEmployees();
  });
}
}
