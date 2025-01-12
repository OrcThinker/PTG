
namespace PTG.CubeMatching.Shapes
{
    public class XShape : ICastableShape
    {
        public bool IsShape3x3(int[,] cubes3x3)
        {
            var selectedColorVal = cubes3x3[1, 1];
            var isCross = cubes3x3[0, 0] == selectedColorVal
                && cubes3x3[2, 0] == selectedColorVal
                && cubes3x3[1, 1] == selectedColorVal
                && cubes3x3[0, 2] == selectedColorVal
                && cubes3x3[2, 2] == selectedColorVal;
            return isCross;
        }

        public List<List<int>> RemoveShape(List<List<int>> startCubes, int xPos, int yPos)
        {
            //Cast spell
            //Remove cubes
            Random r = new Random();

            startCubes[xPos - 1].RemoveAt(yPos+1);
            startCubes[xPos - 1].RemoveAt(yPos-1);
            startCubes[xPos - 1].AddRange(new int[] { r.Next(1, 6), r.Next(1, 6)});
            startCubes[xPos + 1].RemoveAt(yPos+1);
            startCubes[xPos + 1].RemoveAt(yPos-1);
            startCubes[xPos + 1].AddRange(new int[] { r.Next(1, 6), r.Next(1, 6)});
            startCubes[xPos].RemoveAt(yPos);
            startCubes[xPos].Add(r.Next(1, 6));
            return startCubes;
        }
    }
}
