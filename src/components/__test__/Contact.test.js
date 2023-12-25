import {render, screen} from '@testing-library/react';
import Contact from '../Contact';
import '@testing-library/jest-dom';


describe('Contact Us Page Test Cases', () => {

    it('Should load contact us component', () => {
        render(<Contact/>);
    
        const heading = screen.getByRole('heading');
    
        //Assertions
        expect(heading).toBeInTheDocument();
    })
    
    it('Should load button inside Contact component', () => {
        render(<Contact/>);
    
        const button = screen.getByRole('button');
    
        //Assertions
        expect(button).toBeInTheDocument();
    })
    
    it('Should load button inside Contact component', () => {
        render(<Contact/>);
    
        const inputName = screen.getByPlaceholderText('name');
    
        //Assertions
        expect(inputName).toBeInTheDocument();
    })
    
    it('Should load 2 input boxes on the Contact component', () => {
        render(<Contact/>);
    
        // Querying
        const inputBoxes = screen.getAllByRole('textbox');
    
        //Assertions
        expect(inputBoxes.length).toBe(2);
    })
})











