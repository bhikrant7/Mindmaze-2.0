import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RankData = [
  { Rankings: 1, Name: "Alice Smith", Score: 98 },
  { Rankings: 2, Name: "Bob Johnson", Score: 95 },
  { Rankings: 3, Name: "Charlie Brown", Score: 92 },
  { Rankings: 4, Name: "David Lee", Score: 90 },
  { Rankings: 5, Name: "Eve Wilson", Score: 88 },
  { Rankings: 6, Name: "Frank Garcia", Score: 85 },
  { Rankings: 7, Name: "Grace Rodriguez", Score: 82 },
  { Rankings: 8, Name: "Henry Martinez", Score: 80 },
  { Rankings: 9, Name: "Isabella Anderson", Score: 78 },
  { Rankings: 10, Name: "Jack Thomas", Score: 75 },
  { Rankings: 11, Name: "Katie Jackson", Score: 72 },
  { Rankings: 12, Name: "Liam White", Score: 70 },
  { Rankings: 13, Name: "Mia Harris", Score: 68 },
  { Rankings: 14, Name: "Noah Martin", Score: 65 },
  { Rankings: 15, Name: "Olivia Thompson", Score: 62 },
];

export default function LeaderBoardPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat">
      <h1 className="press-start-2p-regular sm:text-5xl md:text-5xl lg:text-7xl top font-bold text-white">
        Leaderboard
      </h1>
      <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-8 my-20 space-y-4 sm:space-y-6 bg-gray/10 rounded-2xl shadow-lg shadow-black/90 backdrop-blur-[5.1px] border">
        <div className="space-y-1 sm:space-y-2 text-center ">
          {/* <h1 className="text-2xl sm:text-3xl text- font-bold tracking-tight font-serif text-red-300">
            Rankings
          </h1> */}
          <Table>
            <TableCaption className="text-sm italic">
              {RankData.length} participating teams
            </TableCaption>
            <TableHeader>
              <TableRow className="uppercase text-lg text-emerald-400 font-extrabold">
                <TableHead className="w-[80px]">Rankings</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RankData.map((data) => (
                <TableRow key={data.Rankings}>
                  <TableCell className="font-medium text-red-300">
                    {data.Rankings}
                  </TableCell>
                  <TableCell className="text-teal-400">{data.Name}</TableCell>
                  <TableCell className="text-green-400">{data.Score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
