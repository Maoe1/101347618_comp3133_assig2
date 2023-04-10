import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';


interface LoginResponse {
  login: string;
}

const LOGIN_QUERY = gql`
  query LoginQuery($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username!: string;
  password!: string;
  errorMessage = '';

  constructor(private apollo: Apollo, private router: Router) {}


  login(event: Event): void {
    event.preventDefault(); // Prevent page reload
    this.apollo
      .query<LoginResponse>({
        query: LOGIN_QUERY,
        variables: {
          username: this.username,
          password: this.password
        }
      })
      .subscribe(
        ({ data }) => {
          console.log(data?.login);
          localStorage.setItem('token', data?.login);
          this.router.navigate(['/employees']);
        },
        error => {
          console.error(error.message);
          this.errorMessage = error.message;
        }
      );
  }
}
