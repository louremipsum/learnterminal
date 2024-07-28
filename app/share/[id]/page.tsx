export default function SharePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div>{params.id}</div>
    </div>
  );
}
