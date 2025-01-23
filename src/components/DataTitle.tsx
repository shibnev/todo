export default function DataTitle() {
  const date = new Date();
  const day = date.getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthIndex = date.getMonth();
  const month = monthNames[monthIndex];

  return (
    <h2 className="text-3xl font-bold mb-4 font-sans">
      <span className='text-stone-800'>Today </span>
      <span className='text-slate-400 font-medium'>
        {day} {month}
      </span>
    </h2>
  )
}
