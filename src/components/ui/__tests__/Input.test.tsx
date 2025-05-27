import { renderWithProviders, screen, userEvent } from '@/__tests__/utils/test-utils'
import Input from '../Input'

describe('Input Component', () => {
  it('renders with default props', () => {
    renderWithProviders(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-gray-300')
  })

  it('renders with label', () => {
    renderWithProviders(<Input label="Email" />)
    
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('id')
  })

  it('shows error state', () => {
    renderWithProviders(<Input error="This field is required" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('handles user input', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    
    renderWithProviders(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test input')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders different types', () => {
    const { rerender } = renderWithProviders(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')
  })

  it('applies custom className', () => {
    renderWithProviders(<Input className="custom-class" />)
    
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('forwards additional props', () => {
    renderWithProviders(<Input placeholder="Enter text" data-testid="custom-input" />)
    
    const input = screen.getByTestId('custom-input')
    expect(input).toHaveAttribute('placeholder', 'Enter text')
  })
}) 