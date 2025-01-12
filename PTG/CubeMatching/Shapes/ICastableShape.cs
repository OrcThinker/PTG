namespace PTG.CubeMatching.Shapes
{
    public interface ICastableShape
    {
        bool IsShape3x3(int[,] cubes3x3);
        List<List<int>> RemoveShape(List<List<int>> startCubes, int xPos, int yPos);
    }
}
