// ========================================================
// Problem: Return the Largest Digit in a Number
// Link: https://takeuforward.org/practice/dsa/return-the-largest-digit-in-a-number
// Date: 2026-10-08
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    int largestDigit(int n) {
        int max=0;
        n=abs(n);
        while(n>0){
            int digit=n%10;
            if(digit>max){
                max=digit;
            }
            n=n/10;
        }
        return max;
    }
};