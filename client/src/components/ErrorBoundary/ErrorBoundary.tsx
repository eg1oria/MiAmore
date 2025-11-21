'use client';

import { Component, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Ошибка в компоненте:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '20px',
          }}>
          <h1>Что-то пошло не так 😢</h1>
          <p>Произошла ошибка в компоненте. Попробуйте обновить страницу.</p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 20px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              marginTop: '20px',
              borderRadius: '5px',
            }}>
            Обновить страницу
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
