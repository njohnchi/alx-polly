// Mock UI components for testing

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ ...props }: any) => <textarea {...props} />,
}));

jest.mock('@/components/ui/switch', () => ({
  Switch: ({ ...props }: any) => <input type="checkbox" {...props} />,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

jest.mock('@/components/ui/form', () => ({
  Form: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  FormControl: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  FormDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  FormField: ({ render, ...props }: any) => render({ field: { value: '', onChange: jest.fn() } }),
  FormItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  FormLabel: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  FormMessage: ({ children, ...props }: any) => <div {...props}>{children || ''}</div>,
}));