function ErrorState({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div>
      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;