
export function ApisForm() {
  return (
    <div className='flex flex-col'>
      <div className='w-full mb-10'>
        <h3 className='font-semibold text-xl mb-4'>Products Information</h3>
        <div className='space-y-4'>
          <div className='flex flex-row items-center justify-between rounded-md border px-3 py-1.5'>
            <div className='flex items-center gap-2'>
              <div className="w-16 inline-flex">
                <span className='truncate text-xs font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
                  Get
                </span>
              </div>
              <p className='text-sm font-medium'>
                ID
              </p>
            </div>
            <p className='truncate text-xs max-w-[200px] font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
              user?.id
            </p>
          </div>
          <div className='flex flex-row items-center justify-between rounded-md border px-3 py-1.5'>
            <div className='flex items-center gap-2'>
              <div className="w-16 inline-flex">
                <span className='truncate text-xs font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
                  Post
                </span>
              </div>
              <p className='text-sm font-medium'>
                ID
              </p>
            </div>
            <p className='truncate text-xs max-w-[200px] font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
              user?.name
            </p>
          </div>
          <div className='flex flex-row items-center justify-between rounded-md border px-3 py-1.5'>
            <div className='flex items-center gap-2'>
              <div className="w-16 inline-flex">
                <span className='truncate text-xs font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
                  Put
                </span>
              </div>
              <p className='text-sm font-medium'>
                ID
              </p>
            </div>
            <p className='truncate text-xs max-w-[200px] font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
              user?.email
            </p>
          </div>
          <div className='flex flex-row items-center justify-between rounded-md border px-3 py-1.5'>
            <div className='flex items-center gap-2'>
              <div className="w-16 inline-flex">
                <span className='truncate text-xs font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
                  Delete
                </span>
              </div>
              <p className='text-sm font-medium'>
                ID
              </p>
            </div>
            <p className='truncate text-xs max-w-[200px] font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
              user?.role
            </p>
          </div>
        </div>
      </div>
      <div className='w-full mb-6'>
        <h3 className='font-semibold text-xl mb-4'>Products Information</h3>
        <div className='space-y-4'>
          <div className='flex flex-row items-center justify-between rounded-md border px-3 py-1.5'>
            <div className='flex items-center gap-2'>
              <div className="w-16 inline-flex">
                <span className='truncate text-xs font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
                  Get
                </span>
              </div>
              <p className='text-sm font-medium'>
                ID
              </p>
            </div>
            <p className='truncate text-xs max-w-[200px] font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
              user?.id
            </p>
          </div>
          <div className='flex flex-row items-center justify-between rounded-md border px-3 py-1.5'>
            <div className='flex items-center gap-2'>
              <div className="w-16 inline-flex">
                <span className='truncate text-xs font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
                  Post
                </span>
              </div>
              <p className='text-sm font-medium'>
                ID
              </p>
            </div>
            <p className='truncate text-xs max-w-[200px] font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
              user?.name
            </p>
          </div>
          <div className='flex flex-row items-center justify-between rounded-md border px-3 py-1.5'>
            <div className='flex items-center gap-2'>
              <div className="w-16 inline-flex">
                <span className='truncate text-xs font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
                  Put
                </span>
              </div>
              <p className='text-sm font-medium'>
                ID
              </p>
            </div>
            <p className='truncate text-xs max-w-[200px] font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
              user?.email
            </p>
          </div>
          <div className='flex flex-row items-center justify-between rounded-md border px-3 py-1.5'>
            <div className='flex items-center gap-2'>
              <div className="w-16 inline-flex">
                <span className='truncate text-xs font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
                  Delete
                </span>
              </div>
              <p className='text-sm font-medium'>
                ID
              </p>
            </div>
            <p className='truncate text-xs max-w-[200px] font-mono px-2 bg-zinc-100 dark:bg-zinc-700 rounded-sm'>
              user?.role
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}