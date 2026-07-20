const Table = ({ columns, rows, keyField = '_id', emptyText = 'No records found' }) => {
  if (rows.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-gray-400">{emptyText}</p>;
  }

  const [primaryCol, ...restCols] = columns;
  const actionsCol = restCols.find((col) => col.key === 'actions');
  const detailCols = restCols.filter((col) => col.key !== 'actions');

  return (
    <>
      <div className="space-y-3 sm:hidden">
        {rows.map((row) => (
          <div key={row[keyField]} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
                {primaryCol.render ? primaryCol.render(row) : row[primaryCol.key]}
              </p>
              {actionsCol && <div className="-mr-1.5 -mt-1 shrink-0">{actionsCol.render(row)}</div>}
            </div>
            <dl className="mt-2.5 space-y-1.5">
              {detailCols.map((col) => (
                <div key={col.key} className="flex items-center justify-between gap-3 text-xs">
                  <dt className="shrink-0 text-gray-400">{col.header}</dt>
                  <dd className="min-w-0 truncate text-right text-gray-700">{col.render ? col.render(row) : row[col.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row[keyField]} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
