import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { infoItems } from "./mock-data";

export default function InformationCard() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-natural">
          What happens next?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {infoItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
