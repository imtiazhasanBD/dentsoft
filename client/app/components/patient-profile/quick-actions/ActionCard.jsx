import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ActionCard({
  title,
  icon,
  buttonText,
  onAction,
  dataAiHint,
}) {
  const IconComponent = icon;
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        {IconComponent && (
          <IconComponent
            className={`h-10 w-10 p-2 text-white rounded-sm ${
              title === "Add Bill"
                ? "bg-green-600"
                : title === "Add X-Ray"
                ? "bg-indigo-600"
                : title === "Add Note"
                ? "bg-amber-600"
                : ""
            }`}
          />
        )}
        <CardTitle className="text-lg font-medium font-headline">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Optional: Image placeholder */}
        {dataAiHint && (
          <div className="mb-4 aspect-video bg-muted rounded-md overflow-hidden">
            <img
              src={`https://placehold.co/300x150.png`}
              alt={title}
              data-ai-hint={dataAiHint}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <Button onClick={onAction} className="w-full bg-blue-500">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
