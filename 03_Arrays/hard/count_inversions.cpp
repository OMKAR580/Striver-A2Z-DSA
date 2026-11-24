// ========================================================
// Problem: Count Inversions
// Link: https://takeuforward.org/practice/dsa/count-inversions
// Date: 2026-11-24
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
   //long long int numberOfInversions(vector<int> nums) {
    //Brute-Force approach..
    // long long int count=0;
    // int n=nums.size();
    // for(int i=0;i<n-1;i++){
    //     for(int j=i+1;j<n;j++){
    //         if(nums[i]>nums[j] && i<j){
    //             count++;
    //         }
    //     }
    // }
    // return count;
     //}
     long long merge(vector<int>& arr,int lb,int mid,int ub){
        vector<int>anu;
        int i=lb;
        int j=mid+1;
        long long count=0;
        while(i<=mid && j <=ub){
            if(arr[i]<=arr[j]){
                anu.push_back(arr[i++]);
            }
            else{
                anu.push_back(arr[j++]);
                count=count+(mid-i+1);
            }
        }
        while (i<=mid){
            anu.push_back(arr[i++]);
        }
        while(j<=ub){
            anu.push_back(arr[j++]);
        }
        for(int k=lb;k<=ub;k++){
            arr[k]=anu[k-lb];
        }
        return count;
     }
     long long mergeSort(vector<int>&arr,int lb,int ub){
        long long count=0;
        if(lb>=ub){
            return count;
        }
        int mid=lb+(ub-lb)/2;
        count +=mergeSort(arr,lb,mid);
        count +=mergeSort(arr,mid+1,ub);
        count +=merge(arr,lb,mid,ub);
        return count;
     }
     long long numberOfInversions(vector<int>& nums){
        int n=nums.size();
        return mergeSort(nums,0,n-1);
     }
};