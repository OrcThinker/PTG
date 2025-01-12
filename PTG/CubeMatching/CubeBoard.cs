using PTG.CubeMatching.Shapes;

namespace PTG.CubeMatching
{
    /// <summary>
    /// This class represents a "tetris-like" board on which we should be able to move
    /// </summary>
    public class CubeBoard
    {
        public static int[,] cubes = new int[10,16];
        public static int width = 10;
        public static int height = 16;

        //For now 1 shape to trigger
        public static List<List<int>> CastCubes(List<List<int>> startCubes, int xPos, int yPos)
        {
            List<ICastableShape> shapesToCheck = new List<ICastableShape>();
            shapesToCheck.Add(new CrossShape());
            shapesToCheck.Add(new XShape());
            //xPos = Math.Clamp(xPos, 0, width);
            //yPos = Math.Clamp(yPos, 0, height);
            //if x is 0 then make it 1, if max then max -1
            xPos = xPos <= 0 ? 1 : xPos;
            xPos = xPos >= width ? width - 1 : xPos;
            yPos = yPos <= 0 ? 1 : yPos;
            yPos = yPos >= height ? height - 1 : yPos;
            int[,] cubes3x3 =
            {
                { startCubes[xPos-1][yPos-1], startCubes[xPos][yPos-1], startCubes[xPos+1][yPos-1]},
                { startCubes[xPos-1][yPos], startCubes[xPos][yPos], startCubes[xPos+1][yPos]},
                { startCubes[xPos-1][yPos+1], startCubes[xPos][yPos+1], startCubes[xPos+1][yPos+1]},
            };

            //Check for shape
            foreach ( var shape in shapesToCheck)
            {
                if (shape.IsShape3x3(cubes3x3))
                {
                    shape.RemoveShape(startCubes, xPos, yPos);
                    break;
                }
            }

            return startCubes;
        }
    }
}
