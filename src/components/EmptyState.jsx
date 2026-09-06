function EmptyState({ message = "No data found." }) {
  return (
    <div>
      <h3>No Results</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;