export type Difficulty = "Easy" | "Medium" | "Hard";
export type ProblemStatus = "completed" | "planned";

export type ProblemArticle = {
  subtitle: string;
  readTime: string;
  focus: string;
  focusTag: string;
  focusDescription: string;
  essence: string;
  equation: {
    currentLabel: string;
    current: string;
    operator: string;
    neededLabel: string;
    needed: string;
    relation: string;
    target: string;
  };
  foundation: {
    name: string;
    definition: string;
    mapping: string;
  };
  initialApproach: {
    label: string;
    title: string;
    description: string;
    complexity: string;
  };
  optimizedApproach: {
    label: string;
    title: string;
    description: string;
    complexity: string;
  };
  code: string;
  codeTitle: string;
  syntaxNote: string;
  takeaways: Array<{ title: string; detail: string }>;
};

export type Problem = {
  id: string;
  title: string;
  titleZh: string;
  difficulty: Difficulty;
  topics: string[];
  date: string;
  status: ProblemStatus;
  statusLabel: string;
  note: string;
  slug: string;
  article?: ProblemArticle;
};

export const problems: Problem[] = [
  {
    id: "001",
    title: "Two Sum",
    titleZh: "两数之和",
    difficulty: "Easy",
    topics: ["哈希表", "数组"],
    date: "2026.08.08",
    status: "completed",
    statusLabel: "已拆解",
    note: "把“找另一个数”改写成一次 O(1) 的查表。",
    slug: "001-two-sum",
    article: {
      subtitle: "从“找答案”到“记住见过什么”",
      readTime: "8 MIN READ",
      focus: "FOUNDATION FIRST · 哈希表入门",
      focusTag: "dict",
      focusDescription: "用空间换时间，把“反复寻找”变成“一次查表”。",
      essence:
        "给定数组 nums 和目标值 target，找出两个数的下标，使它们的和等于目标值。题目问的是“两数之和”，真正决定解法的问题却是：当我看到一个数时，怎样立刻知道它需要的搭档是否已经出现？",
      equation: {
        currentLabel: "当前数字",
        current: "number",
        operator: "+",
        neededLabel: "需要的搭档",
        needed: "target − number",
        relation: "=",
        target: "target",
      },
      foundation: {
        name: "哈希表是什么？",
        definition:
          "哈希表是一种通过键（key）直接访问值（value）的数据结构。它用哈希函数把键映射到存储位置，因此平均情况下，查找、插入和删除都可以在 O(1) 时间完成。",
        mapping:
          "在这道题里，它就是一本随手记：这个数字，我刚才在几号位置见过。",
      },
      initialApproach: {
        label: "BRUTE FORCE / 最初直觉",
        title: "每个数都去问后面所有数",
        description:
          "两层循环一定能找到答案，但同一批数字会被重复检查。数组越长，浪费越明显。",
        complexity: "时间 O(n²) · 空间 O(1)",
      },
      optimizedApproach: {
        label: "HASH LOOKUP / 思路转换",
        title: "一边走，一边留下索引",
        description:
          "不再向后反复寻找。只查“搭档”是否已经记录；若没有，就把当前数记下来。",
        complexity: "时间 O(n) · 空间 O(n)",
      },
      code: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}

        for index, number in enumerate(nums):
            need = target - number

            if need in seen:
                return [seen[need], index]

            seen[number] = index`,
      codeTitle: "一次遍历的 Python 实现",
      syntaxNote:
        "enumerate(nums) 会同时给出索引和元素；need in seen 检查字典中是否存在这个键。",
      takeaways: [
        {
          title: "先改写问题。",
          detail:
            "“哪两个数相加？”可以改写成“对每个数，它需要的另一个数是什么？”",
        },
        {
          title: "识别重复工作。",
          detail:
            "暴力解法慢，是因为它不断重新寻找已经见过的信息。",
        },
        {
          title: "哈希表是记忆。",
          detail:
            "当未来的判断依赖过去见过的元素，优先想一想能否边遍历边记录。",
        },
      ],
    },
  },
  {
    id: "049",
    title: "Group Anagrams",
    titleZh: "字母异位词分组",
    difficulty: "Medium",
    topics: ["哈希表", "字符串", "排序"],
    date: "2026.08.11",
    status: "completed",
    statusLabel: "已拆解",
    note: "不让单词两两比较；为每个单词生成同类共享的 key，再用哈希表分桶。",
    slug: "049-group-anagrams",
    article: {
      subtitle: "不让单词互相比较：先生成身份证，再按 key 分桶",
      readTime: "10 MIN READ",
      focus: "FOUNDATION FIRST · 哈希分组",
      focusTag: "dict",
      focusDescription: "先为同类元素设计相同 key，再让哈希表把它们送进同一个桶。",
      essence:
        "给出一批字符串，把互为字母异位词的字符串放进同一组。真正决定解法的问题不是怎样反复比较两个单词，而是怎样为每个单词生成一个与排列顺序无关、又保留字符种类和次数的分组身份证。",
      equation: {
        currentLabel: "当前单词",
        current: "tea",
        operator: "→ 排序 →",
        neededLabel: "分组身份证",
        needed: "aet",
        relation: "→",
        target: "groups[aet]",
      },
      foundation: {
        name: "哈希表怎样用来分组？",
        definition:
          "哈希表是一种通过键（key）直接访问值（value）的数据结构，平均情况下查询和插入都是 O(1)。用于分组时，可以让 key 表示类别，让 value 保存属于该类别的全部元素。",
        mapping:
          "这道题里，哈希表像一排贴有标签的收纳箱：排序后的字符串是箱子标签，原始单词列表是箱子内容。eat、tea、ate 排序后都是 aet，因此会直接进入同一个箱子。",
      },
      initialApproach: {
        label: "PAIRWISE CHECK / 最初直觉",
        title: "让每个新单词与已有分组逐一比较",
        description:
          "可以把新单词依次与各组的代表单词排序后比较，再决定加入旧组还是创建新组。但字符串会被重复排序和比较，单词越多，重复工作越严重。",
        complexity: "时间 O(n² · k log k) · 空间 O(nk)",
      },
      optimizedApproach: {
        label: "CANONICAL KEY / 思路转换",
        title: "每个单词只算一次身份证，然后直接进桶",
        description:
          "把每个单词排序后的结果作为标准 key。字母异位词一定得到相同 key，于是无需两两比较，只需计算一次 key，再通过哈希表平均 O(1) 定位对应分组。",
        complexity: "时间 O(nk log k) · 空间 O(nk)",
      },
      code: `from collections import defaultdict
from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)

        for s in strs:
            key = "".join(sorted(s))
            groups[key].append(s)

        return list(groups.values())`,
      codeTitle: "排序身份证 + 哈希分桶",
      syntaxNote:
        "sorted(s) 返回字符列表，因此要用 \"\".join(...) 拼回字符串；defaultdict(list) 会在第一次访问新 key 时自动创建空列表。",
      takeaways: [
        {
          title: "分组题先设计身份证。",
          detail:
            "当题目要求把同类元素归组，先寻找一种标准表示：同类得到相同 key，不同类得到不同 key。",
        },
        {
          title: "消灭两两比较。",
          detail:
            "不要让每个单词反复寻找同类；让它独立计算一次 key，再直接定位到对应桶。",
        },
        {
          title: "顺序无关不等于次数无关。",
          detail:
            "set 会丢掉字符出现次数，可能把 abb 和 ab 错分到一起；排序或完整频次统计才能保留组成信息。",
        },
        {
          title: "key 负责定位，原值负责输出。",
          detail:
            "排序结果只用作字典 key，真正追加到列表中的仍应是原始字符串 s。若字符集固定为 26 个小写字母，也可用频次数组转成 tuple，将时间优化为 O(nk)。",
        },
      ],
    },
  },
  {
    id: "070",
    title: "Climbing Stairs",
    titleZh: "爬楼梯",
    difficulty: "Easy",
    topics: ["动态规划", "递推"],
    date: "2026.08.08",
    status: "completed",
    statusLabel: "已拆解",
    note: "从“最后一步从哪来”推出 dp[i] = dp[i−1] + dp[i−2]。",
    slug: "070-climbing-stairs",
    article: {
      subtitle: "第一次真正建立“状态从哪里来”的 DP 直觉",
      readTime: "10 MIN READ",
      focus: "FOUNDATION FIRST · 动态规划入门",
      focusTag: "dp",
      focusDescription: "从最后一步分类，把大问题改写成两个已经解决的小问题。",
      essence:
        "每次只能爬 1 级或 2 级，问到达第 n 级一共有多少种方法。真正的突破口不是去枚举所有走法，而是盯住最后一步：到第 i 级，只可能从第 i−1 级走 1 步，或从第 i−2 级走 2 步。于是当前答案自然由前两个更小答案拼出来。",
      equation: {
        currentLabel: "前一状态",
        current: "dp[i−1]",
        operator: "+",
        neededLabel: "前二状态",
        needed: "dp[i−2]",
        relation: "=",
        target: "dp[i]",
      },
      foundation: {
        name: "动态规划是什么？",
        definition:
          "动态规划（Dynamic Programming）把原问题拆成相互关联的子问题，并保存已经计算过的子问题答案，从而避免重复计算。一个完整的 DP 通常需要明确状态定义、初始状态、状态转移和计算顺序。",
        mapping:
          "在这道题里，dp[i] 只表示一件事：爬到第 i 级的方法数。算 dp[i] 时，不再从地面重新数，而是直接复用 dp[i−1] 和 dp[i−2]。",
      },
      initialApproach: {
        label: "RECURSION / 最初直觉",
        title: "按最后一步递归，但会反复算同一个台阶",
        description:
          "递归关系本身没有错：f(n)=f(n−1)+f(n−2)。问题是 f(3)、f(4) 之类的子问题会在递归树里被重复求很多次，规模一大就迅速爆炸。",
        complexity: "时间约 O(2ⁿ) · 递归栈 O(n)",
      },
      optimizedApproach: {
        label: "DP / 思路转换",
        title: "把算过的小问题留下来，再滚动向前",
        description:
          "先确定 dp[1]=1、dp[2]=2，再从小到大递推。由于 dp[i] 只依赖前两个状态，最终连整张 dp 表也不必保留，只用两个滚动变量即可。",
        complexity: "时间 O(n) · 空间 O(1)",
      },
      code: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n

        prev2, prev1 = 1, 2

        for _ in range(3, n + 1):
            prev2, prev1 = prev1, prev1 + prev2

        return prev1`,
      codeTitle: "滚动变量的 Python 实现",
      syntaxNote:
        "range(3, n + 1) 才会遍历到 n；Python 的多重赋值会先计算右侧，再一起更新左侧，因此 prev2, prev1 = prev1, prev1 + prev2 不会覆盖旧值。",
      takeaways: [
        {
          title: "先做最后一步分析。",
          detail:
            "遇到“到达第 i 个位置有多少种方法”，先问最后一步可能从哪些前置状态走来。",
        },
        {
          title: "先定义状态，再写公式。",
          detail:
            "dp[i] 必须能用一句中文说清楚；本题是“爬到第 i 级的方法数”，然后状态转移才有意义。",
        },
        {
          title: "只依赖前几个状态，就考虑滚动。",
          detail:
            "dp[i] 只看 dp[i−1]、dp[i−2]，完整数组不是必需品，空间可以从 O(n) 压到 O(1)。",
        },
        {
          title: "别只背斐波那契。",
          detail:
            "真正可迁移的触发器是“有限步长 + 到达位置 + 方案计数”，而不是看到楼梯就机械套公式。",
        },
      ],
    },
  },
  {
    id: "128",
    title: "Longest Consecutive Sequence",
    titleZh: "最长连续序列",
    difficulty: "Medium",
    topics: ["集合", "数组"],
    date: "QUEUE",
    status: "planned",
    statusLabel: "题单中",
    note: "不排序，怎样只从一段连续序列的起点出发？",
    slug: "128-longest-consecutive-sequence",
  },
];

export const completedProblems = problems.filter(
  (problem) => problem.status === "completed" && problem.article,
);

export function getProblemBySlug(slug: string) {
  return completedProblems.find((problem) => problem.slug === slug);
}
