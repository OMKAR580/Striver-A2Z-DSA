// ========================================================
// Problem: Union of two sorted arrays
// Link: https://takeuforward.org/plus/dsa/problems/union-of-two-sorted-arrays?source=strivers-a2z-dsa-track
// Date: 2026-09-09
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    vector<int> unionArray(vector<int>& nums1, vector<int>& nums2) {
        int n1=nums1.size();
        int n2=nums2.size();
        int i=0;
        int j=0;
        vector<int>anu;
        while(i<n1 && j<n2){
            if(nums1[i]<=nums2[j]){
                if(anu.size()==0 || anu.back()!=nums1[i]){
                    anu.push_back(nums1[i]);
                }
                i++;
            }
            else{
                if(anu.size()==0 || anu.back()!=nums2[j]){
                    anu.push_back(nums2[j]);
                }
                j++;
            }
        }
        while(i<n1){
            if(anu.size()==0 || anu.back()!=nums1[i]){
                anu.push_back(nums1[i]);
            }
            i++;
        }
        while(j<n2){
            if(anu.size()==0 || anu.back()!=nums2[j]){
                    anu.push_back(nums2[j]);
                }
                j++;
        }
        return anu;
    }
};