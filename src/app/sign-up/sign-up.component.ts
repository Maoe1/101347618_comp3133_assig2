import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';


interface SignUpResponse {
  signup: {
    success: boolean;
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
      password: string;
    } | null;
  }
}



const SIGNUP = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      success
      message
      user {
        id
        username
        email
        password
      }
    }
  }
`;

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent {
  username!: string;
  email!: string;
  password!: string;
  errorMessage = '';

  constructor(private apollo: Apollo, private router: Router) {}
  
  signup(event: Event): void {
    event.preventDefault();
    this.apollo
      .mutate<SignUpResponse>({
        mutation: SIGNUP,
        variables: {
          email: this.email,
          username: this.username,
          password: this.password
        }
      })
      .subscribe(
        ({ data }) => {
          const response = data?.signup;
          if (response) {
            if (response.success) {
              console.log(response);
              this.router.navigate(['/login']);
            } else {
              console.error(response.message);
              // Display error message to the user
              this.errorMessage = response.message;
            }
          }
        },
        error => {
          console.error(error);
         
        }
      );
  }
  
}
