import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.getByText("Contact Form");
    expect(header).toBeInTheDocument()
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const testName = "Max";
    const nameInput = screen.getByLabelText(/first name/i);
    userEvent.type(nameInput, testName);
    const firstNameError = screen.getByText(/error: firstName must have at least 5 characters/i)
    const errorAmt = await screen.findAllByText(/error/i)
    expect(nameInput).toHaveValue(testName);
    expect(firstNameError).toBeInTheDocument();
    expect(errorAmt).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton);
    const errorAmt = await screen.findAllByText(/error/i);
    expect(errorAmt).toHaveLength(3)
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const validFirstName = "Derek";
    const firstNameEntry = screen.getByLabelText(/first name/i);
    const validLastName = "Smith";
    const lastNameEntry = screen.getByLabelText(/last name/i);
    userEvent.type(firstNameEntry, validFirstName);
    userEvent.type(lastNameEntry,validLastName);
    const submitButton = screen.getByText(/submit/i)
    userEvent.click(submitButton)
    const firstNameError = screen.getByText(/error: email must be a valid email address/i)
    const errorAmt = await screen.findAllByText(/error/i);
    expect(firstNameError).toBeInTheDocument();
    expect(errorAmt).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const badEmail = "aaaaa@aaaaa";
    const emailEntry = screen.getByLabelText(/email/i);
    userEvent.type(emailEntry, badEmail);
    const emailErrorMessage = screen.getByText(/error: email must be a valid email address/i);
    expect(emailErrorMessage).toBeInTheDocument();
    expect(emailErrorMessage).toBeVisible()
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByText(/submit/i);
    userEvent.click(submitButton);
    const lastNameError = screen.getByText(/lastname is a required field/i);
    expect(lastNameError).toBeInTheDocument();
    expect(lastNameError).toBeVisible();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    const validFirstName = "Theresa";
    const firstNameEntry = screen.getByLabelText(/first name/i);
    const validLastName = "Underwood";
    const lastNameEntry = screen.getByLabelText(/last name/i);
    const validEmail = "mu@aol.com";
    const emailEntry = screen.getByLabelText(/email/i);
    userEvent.type(firstNameEntry, validFirstName);
    userEvent.type(lastNameEntry, validLastName);
    userEvent.type(emailEntry, validEmail);
    const submitButton = screen.getByText(/submit/i);
    userEvent.click(submitButton);
    screen.debug();
    const validFirstNameDisplay = await screen.getByText(/first name:/i);
    const validLastNameDisplay = await screen.getByText(/last name:/i);
    const validEmailDisplay = await screen.getByText(/email:/i);
    expect(validFirstNameDisplay).toBeInTheDocument();
    expect(validFirstNameDisplay).toBeVisible();
    expect(validLastNameDisplay).toBeInTheDocument();
    expect(validLastNameDisplay).toBeVisible();
    expect(validEmailDisplay).toBeInTheDocument();
    expect(validEmailDisplay).toBeVisible();
    const message = screen.queryByTestId("messageDisplay");
    expect(message).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    const validFirstName = screen.getByLabelText(/first name/i);
    userEvent.type(validFirstName, "Bryan");
    const validLastName = screen.getByLabelText(/last name/i);
    userEvent.type(validLastName, "Malarkey");
    const validEmail = screen.getByLabelText(/email/i);
    userEvent.type(validEmail, "bm@gmail.com");
    const message = screen.getByLabelText(/message/i);
    userEvent.type(message, "hello world");
    const button = screen.getByText('Submit');
    userEvent.click(button);
    const firstNameResponse = await screen.findByText(/first name:/i);
    expect(firstNameResponse).toBeInTheDocument();
    expect(firstNameResponse).toBeVisible();
    const lastNameResponse = await screen.findByText(/last name:/i);
    expect(lastNameResponse).toBeInTheDocument();
    expect(lastNameResponse).toBeVisible();
    const emailResponse = await screen.findByText(/email:/i);
    expect(emailResponse).toBeInTheDocument();
    expect(emailResponse).toBeVisible();
    const messageResponse = await screen.findByText(/message:/i);
    expect(messageResponse).toBeInTheDocument();
    expect(messageResponse).toBeVisible();
});
