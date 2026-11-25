// ========================================================
// Problem: Find the repeating and missing number
// Link: https://takeuforward.org/practice/dsa/find-the-repeating-and-missing-number
// Date: 2026-11-25
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    vector<int> findMissingRepeatingNumbers(vector<int> nums) {
        //bruteforce version...
        // unordered_map<int,int> anu;
        // vector<int>suna;
        // long long sum=0;
        // long long sum1=0;
        // for(int i=0;i<nums.size();i++){
        //     anu[nums[i]]++;
        //     if(anu[nums[i]]>1){
        //         suna.push_back(nums[i]);
        //     }
        //     sum=sum+i+1;
        //     sum1=sum1+nums[i];
        // }
        // int diff=sum-(sum1-suna[0]);
        // suna.push_back(diff);
        //  return suna;

        //Optimal version time complexity: O(N) in both solution but space complexity :O(N) se O(1);

        long long n=nums.size();
        long long SN=(n * (n+1))/2; //sum of first n numbers.. fixed formula..
        long long S2N=(n*(n+1)*(2*n+1))/6; //sum of  squares..fixed formula...
        long S=0,S2=0;
        for(int i=0;i<n;i++){
            S= S+nums[i];
            S2=S2+ (long long) nums[i]*nums[i];
        }
        long long val1=S-SN; //X-Y
        long long val2=(S2-S2N); //X^2 -Y^2
        val2=val2/val1; //X+Y
        long long x=(val1+val2)/2; //repeating..
        long long y= x-val1; //missing..
        return {(int)x,(int)y};
    }
};