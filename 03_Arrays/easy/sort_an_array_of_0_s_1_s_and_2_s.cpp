// ========================================================
// Problem: Sort an array of 0's 1's and 2's
// Link: https://takeuforward.org/practice/dsa/sort-an-array-of-0's-1's-and-2's
// Date: 2026-10-21
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    void sortZeroOneTwo(vector<int>& nums) {
        //brute-force code...
        //brute-force-1..
        //sort(nums.begin(),nums.end());
        //brute-force-2...
        // for(int i=0;i<nums.size()-1;i++){
        //     for(int j=i+1;j<nums.size();j++){
        //         if(nums[i]>=nums[j]){
        //             swap(nums[i],nums[j]);
        //         }
        //     }
        // }
        //optimal-code...
        int low=0,mid=0,high=nums.size()-1;
        while(mid<=high){
            if(nums[mid]==0){
                swap(nums[low],nums[mid]);
                low++;
                mid++;
            }
            else if(nums[mid]==1){
                mid++;
            }
            else{
                swap(nums[mid],nums[high]);
                high--;
            }
        }

        
    }
};