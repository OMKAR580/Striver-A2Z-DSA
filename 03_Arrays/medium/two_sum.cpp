// ========================================================
// Problem: Two Sum
// Link: https://takeuforward.org/practice/dsa/two-sum
// Date: 2026-10-20
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        //Optimal Solution har bar check krna hai ki target-nums[i] present hai to answer mil gya...
        unordered_map<int,int>anu;
        for(int i=0;i<nums.size();i++){
            int k=target-nums[i];
            if(anu.find(k)!=anu.end()){
                return{anu[k],i};
            }
            anu[nums[i]]=i;
        }
        return {};
    }
        //brute-force...
    //     for(int i=0;i<nums.size()-1;i++){
    //         for(int j=i+1;j<nums.size();j++){
    //             if(nums[i]+nums[j]==target){
    //                 return{i,j};
    //             }

    //         }
    //     }
    //     return {};
    // }
};