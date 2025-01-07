using Microsoft.AspNetCore.SignalR;

namespace PTG.SignalR.Hubs
{
    public class ChatHub : Hub
    {
        public static int[,] cubes = new int[10,16];
        private int height = 10;
        private int width = 10;
        public static List<List<int>> cubesAsList = new();
        private static bool initialized = false;

        private void FillCubes()
        {
            Random r = new Random();
            for (int x = 0; x < width; x++)
            {
                cubesAsList.Add(new List<int>());
                for(int y = 0; y < height; y++)
                {
                    cubesAsList[x].Add(r.Next(1, 6));
                }
            }
        }

        public ChatHub() : base()
        {
            if (!initialized)
            {
                initialized = true;
                FillCubes();
            }
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMsg", user, cubesAsList);
        }

        public async Task SendCubes(string user)
        {
            await Clients.Caller.SendAsync("ReceiveCubes", cubesAsList);
        }
        public async Task RandomizeCubes(string user)
        {
            cubesAsList = new List<List<int>>();
            FillCubes();
            await Clients.All.SendAsync("ReceiveCubes", cubesAsList);
        }
        public async Task SwapCubes(string user, int pos1X, int pos1Y, int pos2X, int pos2Y)
        {
            var temp = cubesAsList[pos1X][pos1Y];
            cubesAsList[pos1X][pos1Y] = cubesAsList[pos2X][pos2Y];
            cubesAsList[pos2X][pos2Y] = temp;
            await Clients.All.SendAsync("ReceiveCubes", cubesAsList);
        }

        public async Task MoveRect(string user, string direction)
        {
            await Clients.All.SendAsync("ReceiveMoveRect", user, direction);
        }
    }
}
