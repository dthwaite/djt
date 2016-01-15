DJT.classes.LifePatterns=function() {
    var shapes = {
        block: [[0, 0], [1, 0], [0, 1], [1, 1]],
        x_blinker: [[0, 1], [1, 1], [2, 1]],
        y_blinker: [[1, 0], [1, 1], [1, 2]],
        glider_1: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
        glider_2: [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]],
        glider_3: [[2, 1], [0, 2], [2, 2], [1, 3], [2, 3]],
        glider_4: [[1, 1], [2, 2], [3, 2], [1, 3], [2, 3]],
        glider_5: [[2, 1], [3, 2], [1, 3], [2, 3], [3, 3]]
    };

    // Sets a pattern from a list of set cells into the grid
    function setPattern(pattern,Xoffset,Yoffset) {
        if (Xoffset==undefined) Xoffset=0;
        if (Yoffset==undefined) Yoffset=0;
        var cells = [];
        for (var coord in shapes[pattern]) cells.push({
            x: shapes[pattern][coord][0]+Xoffset,
            y: shapes[pattern][coord][1]+Yoffset,
            v: true
        });
        life.apply(cells);
        return cells;
    }

    // Checks the set of cells to equate the shape provided
    function checkPattern(cells, pattern,Xoffset,Yoffset) {
        if (Xoffset==undefined) Xoffset=0;
        if (Yoffset==undefined) Yoffset=0;
        if (cells.length != shapes[pattern].length) return false;
        for (var index1 in cells) {
            var cell = cells[index1];
            var found = false;
            for (var index2 in shapes[pattern]) {
                var coord = shapes[pattern][index2];
                if (cell.x == coord[0]+Xoffset && cell.y == coord[1]+Yoffset && cell.v) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    }
};