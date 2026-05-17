require("dotenv").config();

const mongoose = require("mongoose");

const Problem = require("./models/problems");

const MONGO_URI = process.env.DB_CONNECT_STRING;

const ADMIN_USER_ID = "69c2c34650a877b51a020de6";

const problems = [
  {
    title: "Valid Parentheses",

    description:
      "Given a string containing just the characters (), {}, [], determine if the input string is valid.",

    difficulty: "easy",

    tags: ["stack", "string"],

    visibleTestCases: [
      {
        input: "()[]{}",
        output: "true",
        explanation: "All brackets are balanced.",
      },
    ],

    hiddenTestCases: [
      {
        input: "([)]",
        output: "false",
      },
    ],

    startCode: [
      {
        language: "cpp",
        initialCode: `#include <bits/stdc++.h>
using namespace std;

void solve(){

}

int main(){
  solve();
  return 0;
}`,
      },
    ],

    referenceSolution: [
      {
        language: "cpp",
        completeCode: `#include <bits/stdc++.h>
using namespace std;

void solve(){

  string s;
  cin>>s;

  stack<char> st;

  for(char ch:s){

    if(ch=='(' || ch=='{' || ch=='['){
      st.push(ch);
    }
    else{

      if(st.empty()){
        cout<<"false";
        return;
      }

      char top=st.top();
      st.pop();

      if(
        (ch==')' && top!='(') ||
        (ch=='}' && top!='{') ||
        (ch==']' && top!='[')
      ){
        cout<<"false";
        return;
      }
    }
  }

  cout<<(st.empty() ? "true" : "false");
}

int main(){
  solve();
  return 0;
}`,
      },
    ],

    problemCreator: ADMIN_USER_ID,
  },

  {
    title: "Top K Frequent Elements",

    description:
      "Given an integer array nums and an integer k, return the k most frequent elements.",

    difficulty: "medium",

    tags: ["heap", "hashing", "array"],

    visibleTestCases: [
      {
        input: "6\n1 1 1 2 2 3\n2",
        output: "1 2",
        explanation: "1 and 2 are the most frequent elements.",
      },
    ],

    hiddenTestCases: [
      {
        input: "5\n4 4 4 5 5\n1",
        output: "4",
      },
    ],

    startCode: [
      {
        language: "cpp",
        initialCode: `#include <bits/stdc++.h>
using namespace std;

void solve(){

}

int main(){
  solve();
  return 0;
}`,
      },
    ],

    referenceSolution: [
      {
        language: "cpp",
        completeCode: `#include <bits/stdc++.h>
using namespace std;

void solve(){

  int n;
  cin>>n;

  vector<int> nums(n);

  for(int i=0;i<n;i++){
    cin>>nums[i];
  }

  int k;
  cin>>k;

  unordered_map<int,int> freq;

  for(int x:nums){
    freq[x]++;
  }

  priority_queue<pair<int,int>> pq;

  for(auto it:freq){
    pq.push({it.second,it.first});
  }

  while(k--){

    cout<<pq.top().second<<" ";

    pq.pop();
  }
}

int main(){
  solve();
  return 0;
}`,
      },
    ],

    problemCreator: ADMIN_USER_ID,
  },

  {
    title: "Daily Temperatures",

    description:
      "Given a list of daily temperatures, return how many days you would have to wait until a warmer temperature.",

    difficulty: "medium",

    tags: ["stack", "array"],

    visibleTestCases: [
      {
        input: "8\n73 74 75 71 69 72 76 73",
        output: "1 1 4 2 1 1 0 0",
        explanation: "Wait days for warmer temperature.",
      },
    ],

    hiddenTestCases: [
      {
        input: "3\n30 40 50",
        output: "1 1 0",
      },
    ],

    startCode: [
      {
        language: "cpp",
        initialCode: `#include <bits/stdc++.h>
using namespace std;

void solve(){

}

int main(){
  solve();
  return 0;
}`,
      },
    ],

    referenceSolution: [
      {
        language: "cpp",
        completeCode: `#include <bits/stdc++.h>
using namespace std;

void solve(){

  int n;
  cin>>n;

  vector<int> temp(n);

  for(int i=0;i<n;i++){
    cin>>temp[i];
  }

  vector<int> ans(n,0);

  stack<int> st;

  for(int i=n-1;i>=0;i--){

    while(!st.empty() && temp[st.top()]<=temp[i]){
      st.pop();
    }

    if(!st.empty()){
      ans[i]=st.top()-i;
    }

    st.push(i);
  }

  for(int x:ans){
    cout<<x<<" ";
  }
}

int main(){
  solve();
  return 0;
}`,
      },
    ],

    problemCreator: ADMIN_USER_ID,
  },

  {
    title: "Trapping Rain Water",

    description:
      "Given n non-negative integers representing elevation map, compute how much water it can trap.",

    difficulty: "hard",

    tags: ["twoPointers", "array"],

    visibleTestCases: [
      {
        input: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
        output: "6",
        explanation: "Total trapped water is 6.",
      },
    ],

    hiddenTestCases: [
      {
        input: "6\n4 2 0 3 2 5",
        output: "9",
      },
    ],

    startCode: [
      {
        language: "cpp",
        initialCode: `#include <bits/stdc++.h>
using namespace std;

void solve(){

}

int main(){
  solve();
  return 0;
}`,
      },
    ],

    referenceSolution: [
      {
        language: "cpp",
        completeCode: "Add two pointer solution here",
      },
    ],

    problemCreator: ADMIN_USER_ID,
  },

  {
    title: "Course Schedule II",

    description:
      "Return the ordering of courses you should take to finish all courses.",

    difficulty: "hard",

    tags: ["graph", "topologicalSort", "bfs"],

    visibleTestCases: [
      {
        input: "4 4\n1 0\n2 0\n3 1\n3 2",
        output: "0 1 2 3",
        explanation: "One valid topological ordering.",
      },
    ],

    hiddenTestCases: [
      {
        input: "2 2\n0 1\n1 0",
        output: "-1",
      },
    ],

    startCode: [
      {
        language: "cpp",
        initialCode: `#include <bits/stdc++.h>
using namespace std;

void solve(){

}

int main(){
  solve();
  return 0;
}`,
      },
    ],

    referenceSolution: [
      {
        language: "cpp",
        completeCode: "Add Kahn's Algorithm solution here",
      },
    ],

    problemCreator: ADMIN_USER_ID,
  },
];

const seedProblems = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected");

    await Problem.insertMany(problems);

    console.log("Problems Seeded Successfully");

    process.exit(0);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedProblems();
