import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@diatonic/ui'

export function SharedComponentsDemo() {
  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Vite App - Shared Components Demo</h1>

      <div className="space-y-6">
        {/* Buttons Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <p className="text-sm text-muted-foreground">Buttons from shared component library</p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="subtle">Subtle</Button>
          </CardContent>
          <div className="p-6 pt-0 text-sm text-muted-foreground">
            All variants provided by @diatonic/ui/button
          </div>
        </Card>

        {/* Form Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
            <p className="text-sm text-muted-foreground">
              Input components from @diatonic/ui styled with tokens
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground" htmlFor="email">
                Email
              </label>
              <Input type="email" id="email" placeholder="Email" />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground" htmlFor="password">
                Password
              </label>
              <Input type="password" id="password" placeholder="Password" />
            </div>

            <Button type="submit" className="w-full max-w-sm">
              Sign In
            </Button>
          </CardContent>
          <div className="p-6 pt-0 text-sm text-muted-foreground">
            Using @diatonic/ui input component with custom labels
          </div>
        </Card>

        {/* Card Demo */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
                <p className="text-sm text-muted-foreground">Example card component</p>
              </CardHeader>
              <CardContent>
                <p>
                  Card content goes here. This demonstrates the Card component from the @diatonic/ui
                  library.
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="outline" size="sm">
                  Action
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Success Message */}
        <Card className="border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Badge variant="success" className="px-2">
                Success
              </Badge>
              <div>
                <h3 className="font-semibold text-green-900">Shared Components Working!</h3>
                <p className="text-sm text-green-700">
                  All components successfully imported from the @diatonic/ui package
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
