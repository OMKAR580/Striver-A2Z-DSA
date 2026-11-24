// ========================================================
// Problem: Majority Element-II
// Link: https://takeuforward.org/practice/dsa/majority-element-ii
// Date: 2026-11-24
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    vector<int> majorityElementTwo(vector<int>& nums) {
        //brute-force version..
    //     int n=nums.size();
    //     int a=n/3;
    //     vector<int>anu;
    //     for(int i=0;i<n-1;i++){
    //         if (anu.size()==0 || anu[0]!=nums[i]) {
    //             int count=1;
    //             for(int j=i+1;j<n;j++){
    //                 if(nums[i]==nums[j]){
    //                     count++;
    //                 }
    //             }
    //             if(count>a){
    //                 anu.push_back(nums[i]);
    //             }
    //             if(anu.size()>2){
    //                 break;
    //             }
    //         }
    //     }
    //    return anu; 
    //optimal version form O(n^2) to O(n)..
    int n=nums.size();
    int a=n/3;
    unordered_map<int,int> anu;
    vector<int>sunayana;
    for(int x:nums){
        anu[x]++;
        if(anu[x]==a+1){
            sunayana.push_back(x);
        }
    }
    return sunayana;
    }
};