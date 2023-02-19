import "@testing-library/jest-dom/"
import { render, fireEvent, getByText } from "@testing-library/svelte"
import Counter from "../Counter.svelte"

it('it works', async () => {
  const {getByText, getByTestId} = render(Counter)

  const increment = getByText('count is 0')
  const counter = getByTestId('counter-value')
 
  await fireEvent.click(increment)
  await fireEvent.click(increment)
 
  expect(counter.textContent).toBe('count is 2')
})
