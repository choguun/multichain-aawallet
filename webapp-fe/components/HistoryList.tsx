import React from 'react';

const HistoryList = ({ transactions }: any) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left"><span>Transaction Hash</span></th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left"><span>From</span></th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left"><span>To</span></th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-right"><span>Value</span></th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-right"><span>Timestamp</span></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction: any) => (
          <tr key={transaction.hash}>
            <tr className="px-6 py-4 border-b border-gray-300">
              <span className="text-gray-900">{transaction.hash}</span>
              <span className="text-gray-900">{transaction.from}</span>
              <span className="text-gray-900">{transaction.to}</span>
              <span className="text-gray-900 text-right">{transaction.value}</span>
              <span className="text-gray-900 text-right">{transaction.timestamp}</span>
            </tr>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryList;