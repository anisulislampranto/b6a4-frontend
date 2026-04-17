import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityTableCardProps {
  title: string;
  columns: string[];
  rows: string[][];
  emptyText?: string;
}

export default function ActivityTableCard({
  title,
  columns,
  rows,
  emptyText = "Nothing to show yet.",
}: ActivityTableCardProps) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {rows.length ? (
          <div className="overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead className="bg-muted/40">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-3 py-2 text-left font-semibold text-foreground">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={`${rowIndex}-${row[0]}`} className="border-t border-border/70">
                    {row.map((cell, cellIndex) => (
                      <td key={`${rowIndex}-${cellIndex}`} className="px-3 py-2 text-muted-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  );
}
