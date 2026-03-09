import { Component } from "react"

class ErrorBoundary extends Component {

  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      resetKey: 0
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error, errorInfo) {

    console.error("Error caught by boundary:", error, errorInfo)

    // Example future integrations
    // Sentry.captureException(error)
    // logErrorToService(error, errorInfo)

  }

  resetError = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      resetKey: prev.resetKey + 1
    }))
  }

  render() {

    if (this.state.hasError) {

      return (

        <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white">

          <div className="text-center max-w-md px-6">

            <h2 className="text-2xl font-bold mb-4">
              Something went wrong
            </h2>

            <p className="text-gray-400 mb-6">
              An unexpected error occurred. Please try again.
            </p>

            {/* Optional dev error message */}

            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="text-xs text-red-400 mb-6 whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex gap-3 justify-center">

              <button
                onClick={this.resetError}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded"
              >
                Reload Page
              </button>

            </div>

          </div>

        </div>

      )
    }

    return (
      <div key={this.state.resetKey}>
        {this.props.children}
      </div>
    )
  }

}

export default ErrorBoundary