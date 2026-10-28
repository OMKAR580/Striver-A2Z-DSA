// ========================================================
// Problem: Merge Sorting
// Link: https://takeuforward.org/practice/dsa/merge-sorting
// Date: 2026-10-28
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    vector<int> mergeSort(vector<int>& nums) {
        int lb=0,ub=nums.size()-1;
        solve(nums,lb,ub);
        return nums;
    }
    void solve(vector<int>&nums,int lb,int ub){
        if(lb<ub){
            int mid=(lb+ub)/2;
            solve(nums,lb,mid);
            solve(nums,mid+1,ub);
            merge(nums,lb,mid,ub);
        }
    }
    void merge(vector<int>&nums,int lb,int mid,int ub){
        vector<int>anu;
        int i=lb;
        int j=mid+1;
        while(i<=mid && j<=ub){
            if(nums[i]<=nums[j]){
               anu.push_back(nums[i++]);
            }
            else{
                anu.push_back(nums[j++]);
            }
        }
            while(i<=mid){
                anu.push_back(nums[i++]);
            }

        
            while(j<=ub){
                anu.push_back(nums[j++]);
            }

        for(int k=lb;k<=ub;k++){
            nums[k]=anu[k-lb];
        }

    }
};
