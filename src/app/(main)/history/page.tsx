import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const activities = [
    { id: 1, type: "Analysis", details: "Resume v4 uploaded", result: "88/100", date: "2 days ago" },
    { id: 2, type: "Job Match", details: "Software Engineer at TechCorp", result: "92%", date: "3 days ago" },
    { id: 3, type: "Rewrite", details: "Rewrote 3 bullet points", result: "+5 impact", date: "5 days ago" },
    { id: 4, type: "Analysis", details: "Resume v3 uploaded", result: "82/100", date: "1 week ago" },
];

export default function HistoryPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Activity History</h1>
        <p className="text-muted-foreground">A complete log of all your activities on CareerBoost AI.</p>
      </header>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[150px] text-right">Result</TableHead>
                <TableHead className="w-[150px] text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                     <Badge
                        variant={
                          activity.type === 'Analysis'
                            ? 'default'
                            : activity.type === 'Job Match'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {activity.type}
                      </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{activity.details}</TableCell>
                  <TableCell className="text-right">{activity.result}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{activity.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
