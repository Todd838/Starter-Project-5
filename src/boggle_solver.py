# Burge's Solution - Boggle Solver using HashMap


class TrieNode:
    """A simple Trie node for efficient prefix and word lookup."""
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    """Trie data structure for dictionary word storage and prefix pruning."""
    def __init__(self, words):
        self.root = TrieNode()
        for word in words:
            self.insert(word)

    def insert(self, word):
        node = self.root
        for char in word:
            node = node.children.setdefault(char, TrieNode())
        node.is_end = True

    def has_prefix(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

    def is_word(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end


class Boggle:
    """Boggle solver using DFS with Trie-based prefix pruning."""

    def __init__(self, grid, dictionary, min_length=3, multi_cells=None):
        """
        Initialize Boggle solver.

        Args:
            grid (list[list[str]]): 2D list of letters or multi-letter cells.
            dictionary (iterable[str]): Set or list of valid words.
            min_length (int): Minimum word length (default=3).
            multi_cells (set[str]): Optional multi-letter tiles (e.g. {"QU"}).
        """
        self.grid_original = grid
        self.grid = [
            [cell.upper() if cell else "" for cell in row]
            for row in grid
        ]
        self.dictionary_original = {
            word.upper(): word for word in dictionary
        }
        self.trie = Trie(word.upper() for word in dictionary)
        self.min_length = min_length
        self.multi_cells = multi_cells or {"QU", "ST", "IE"}
        self.solutions = set()

    def setGrid(self, grid):
        """Reset the grid and normalize it."""
        self.grid_original = grid
        self.grid = [
            [cell.upper() if cell else "" for cell in row]
            for row in grid
        ]

    def setDictionary(self, dictionary):
        """Reset the dictionary and rebuild the Trie."""
        self.dictionary_original = {
            word.upper(): word for word in dictionary
        }
        self.trie = Trie(word.upper() for word in dictionary)

    def _in_bounds(self, r, c):
        """Check if coordinates are within grid bounds."""
        return 0 <= r < len(self.grid) and 0 <= c < len(self.grid[r])

    def _dfs(self, r, c, visited, current_word, current_upper):
        """Depth-first search to find words in the grid."""
        if not self._in_bounds(r, c) or (r, c) in visited:
            return

        cell = self.grid[r][c]
        if not cell:
            return

        cell_original = (
            self.grid_original[r][c]
            if r < len(self.grid_original)
            and c < len(self.grid_original[r])
            else cell
        )

        # Combine multi-letter cells dynamically
        new_word = current_word + cell_original
        new_upper = current_upper + cell

        if not self.trie.has_prefix(new_upper):
            return

        if (
            len(new_upper) >= self.min_length
            and self.trie.is_word(new_upper)
        ):
            self.solutions.add(new_word)

        visited.add((r, c))

        # Explore all 8 directions
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                if dr == 0 and dc == 0:
                    continue
                self._dfs(r + dr, c + dc, visited, new_word, new_upper)

        visited.remove((r, c))

    def getSolution(self):
        """Find all valid words on the Boggle board."""
        if not self.grid or not self.grid[0]:
            return []

        self.solutions = set()
        rows = len(self.grid)
        cols = len(self.grid[0])

        for r in range(rows):
            for c in range(cols):
                self._dfs(r, c, set(), "", "")

        return sorted(self.solutions, key=str.upper)
