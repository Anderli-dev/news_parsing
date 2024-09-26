const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom/extend-expect');
const axios = require('axios');
const { Login } = require('./pages/Login.js');
const { MemoryRouter } = require('react-router-dom');
const { Provider } = require('react-redux');
import { store } from './store';

jest.mock('axios');

describe('Login Component', () => {
    test('displays error message for incorrect username', async () => {
        axios.post.mockRejectedValue({
            response: {
                data: { error: 'Incorrect username or password' },
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>
        );

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Incorrect username or password')).toBeInTheDocument();
        });
    });
});
