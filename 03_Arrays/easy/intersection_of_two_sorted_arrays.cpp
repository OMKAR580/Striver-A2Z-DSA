// ========================================================
// Problem: Intersection of two sorted arrays
// Link: https://takeuforward.org/practice/dsa/intersection-of-two-sorted-arrays
// Date: 2026-09-21
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    vector<int> intersectionArray(vector<int>& nums1, vector<int>& nums2) {
        unordered_map<int,int>freq;
        for(int x:nums1){
            freq[x]++;
        }
        vector<int>anu;
        for(int i:nums2){
            if(freq.count(i)&& freq[i]>0){
                anu.push_back(i);
                freq[i]=0;
            }
        }
        return anu;
    }
};