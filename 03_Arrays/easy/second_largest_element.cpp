// ========================================================
// Problem: Second Largest Element
// Link: https://takeuforward.org/plus/dsa/problems/second-largest-element?source=strivers-a2z-dsa-track
// Date: 2026-09-01
// Striver's A2Z DSA Sheet Solution
// ========================================================

#include <vector>
using namespace std;

class Solution {
public:
    int secondLargestElement(vector<int>& nums) {
        int max = -1;
        int sec_max = -1;
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] > max) {
                sec_max = max;
                max = nums[i];
            } else if (nums[i] < max && nums[i] > sec_max) {
                sec_max = nums[i];
            }
        }
        return sec_max;
    }
};