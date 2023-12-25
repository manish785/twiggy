import { sum } from '../sum';


test('Sum functions should calculate the sum of tow numbers', () => {
   
    const result = sum(3, 4);
 
    // Assesrations -
    expect(result).toBe(7);
})