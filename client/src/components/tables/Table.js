import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { getValues } from "../../actions/valuesAction";
import { useDispatch, useSelector } from "react-redux";
import { getGraphData } from "../../actions/graphsAction";
import moment from "moment";

const columns = [
  {
    id: "ticker",
    label: "Ticker",
    minWidth: 170
  },
  {
    id: "opt_type",
    label: "Option Type",
    minWidth: 100,
    align: "center"
  },
  {
    id: "opt_side",
    label: "Side",
    minWidth: 100,
    align: "center"
  },
  {
    id: "strike",
    label: "Strike",
    minWidth: 100,
    align: "center",
    format: value => value.toLocaleString()
  },
  {
    id: "expiry",
    label: "Expiry",
    minWidth: 100,
    align: "center",
    format: value => value.toLocaleString()
  },
  {
    id: "price",
    label: "Price",
    minWidth: 100,
    align: "center",
    format: value => value.toLocaleString()
  },
  {
    id: "qty",
    label: "Quantity",
    minWidth: 100,
    align: "center",
    format: value => value.toLocaleString()
  }
  /*{{
    id: "density",
    label: "Density",
    minWidth: 170,
    align: "right",
    format: value => value.toFixed(2)
  }}*/
];

function createData(ticker, opt_type, opt_side, strike, expiry, price, qty) {
  return { ticker, opt_type, strike, opt_side, expiry, price, qty };
}

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  }
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // net debit/credit state
  const netDebitCreditState = React.useState(0);

  // const options
  const optionsState = React.useState([]);

  // Get state values
  const values = useSelector(state => state.values);
  const dispatch = useDispatch();
  // Toggle css state
  const [toggleCSSState, setValue] = React.useState("lmao3");

  // Graph Data
  const graphValues = useSelector(state => state.graphValues);

  React.useEffect(() => {
    if (netDebitCreditState[0] > 0) {
      setValue("lmao2");
    } else {
      setValue("lmao3");
    }
    console.log(rows);
  });

  const rows = [];
  rows[0] = {
    ticker: "",
    opt_type: "",
    opt_side: "",
    strike: "",
    expiry: "",
    price: "",
    qty: ""
  };
  let ctr = 0;
  let net_debit_credit = 0;
  let change_counter = 1;
  let data_price;
  let spliceCtr = 0;
  let checkCtr = 0;
  if (values.values.length > 0) {
    // console.log('ROWS', rows.length)
    values.values[2].map(data => {
      for (let i = 0; i < rows.length; i++) {
        // console.log("DATA", data);
        // console.log("VALUE OF EYE", i);

        if (data[0].strike === rows[i].strike && data[3] === rows[i].opt_type) {
          const prices = rows[i].price;
          if (data[1] == "call_ask") {
            rows[i].price -= data[0].call_ask;
            rows[i].qty += 1;
            netDebitCreditState[0] -= data[0].call_ask * -1;
            // i = undefined;
            data_price = undefined;
            change_counter = 1;
            if (rows[i].qty > 0) {
              rows[i].opt_side = "BUY";
            }
            if (rows[i].qty < 0) {
              rows[i].opt_side = "SELL";
            }
            if (rows[i].qty === 0) {
              spliceCtr = i;
            }
          }
          if (data[1] == "call_bid") {
            rows[i].price += data[0].call_bid;
            rows[i].qty -= 1;
            netDebitCreditState[0] += data[0].call_bid * -1;
            // i = undefined;
            data_price = undefined;
            change_counter = 1;
            if (rows[i].qty > 0) {
              rows[i].opt_side = "BUY";
            }
            if (rows[i].qty < 0) {
              rows[i].opt_side = "SELL";
            }
            if (rows[i].qty === 0) {
              spliceCtr = i;
            }
          }
          if (data[1] == "puts_ask") {
            rows[i].price -= data[0].puts_ask;
            rows[i].qty += 1;
            netDebitCreditState[0] -= data[0].puts_ask * -1;
            // i = undefined;
            data_price = undefined;
            change_counter = 1;
            if (rows[i].qty > 0) {
              rows[i].opt_side = "BUY";
            }
            if (rows[i].qty < 0) {
              rows[i].opt_side = "SELL";
            }
            // if (rows[i].qty === 0) {
            //   spliceCtr = i;
            // }
            if (rows[i].qty === 0) {
              rows.splice(i, 1);
            }
          }
          if (data[1] == "puts_bid") {
            rows[i].price += data[0].puts_bid;
            rows[i].qty -= 1;
            netDebitCreditState[0] += data[0].puts_bid * -1;
            // i = undefined;
            data_price = undefined;
            change_counter = 1;
            if (rows[i].qty > 0) {
              rows[i].opt_side = "BUY";
            }
            if (rows[i].qty < 0) {
              rows[i].opt_side = "SELL";
            }
            // if (rows[i].qty === 0) {
            //   spliceCtr = i;
            // }
            if (rows[i].qty === 0) {
              rows.splice(i, 1);
            }
          }
          if (spliceCtr !== 0) {
            rows.splice(i, 1);
            spliceCtr = 0;
          }
        }

        // Splice rows array if the quantity value is 0
        else {
          change_counter = 0;
        }
      }

      if (change_counter === 0) {
        const ticker = "BANKNIFTY";
        let opt_type = "";
        let opt_side = "";
        const strike = data[0].strike;
        const expiry = data[0].expiry;
        let price = 0;
        let qty = 0;
        if (data[1] === "call_ask") {
          opt_type = "CE";
          opt_side = "BUY";
          price -= data[0].call_ask;
          qty += 1;
        }
        if (data[1] === "call_bid") {
          opt_type = "CE";
          opt_side = "SELL";
          price += data[0].call_bid;
          qty -= 1;
        }
        if (data[1] === "puts_ask") {
          opt_type = "PE";
          opt_side = "BUY";
          price -= data[0].puts_ask;
          qty += 1;
        }
        if (data[1] === "puts_bid") {
          opt_type = "PE";
          opt_side = "SELL";
          price += data[0].puts_bid;
          qty -= 1;
        }
        rows.push({
          ticker,
          opt_type,
          opt_side,
          strike,
          expiry,
          price,
          qty
        });
        netDebitCreditState[0] += price * -1;
        change_counter = 1;
      }

      ctr++;
    });
    if (netDebitCreditState >= 0) {
      toggleCSSState = "lmao2";
    }
  }

  // Send Request to the python server for risk profile values
  const sendRiskProfileValues = () => {
    const socket = new WebSocket("ws://localhost:9090");
    let graphData;

    socket.addEventListener("open", event => {
      const final_graph_data_array = [];
      for (let i = 1; i < rows.length; i++) {
        const underlying = rows[i].ticker.toLowerCase();
        const quantity = rows[i].qty;
        const opt_type = rows[i].opt_type.slice(0, 1);
        const strike = rows[i].strike;
        const price = rows[i].price;
        let expiry1 = moment(rows[i].expiry, "DD/MM/YYYY").format("D MMMM Y");
        expiry1 = expiry1.toLowerCase();
        const expiry =
          expiry1.slice(0, 2) + expiry1.slice(3, 6) + expiry1.slice(12, 16);
        final_graph_data_array.push({
          underlying: underlying,
          expiry: expiry,
          quantity: quantity,
          opt_type: opt_type,
          strike: strike,
          price: price
        });
      }
      const toSend = {
        no_legs: rows.length - 1,
        Legs: JSON.parse(JSON.stringify(final_graph_data_array)),
        net_credit_debit: netDebitCreditState[0]
      };
      console.log("TOOOO SEND", toSend);
      // const check = JSON.stringify(final_graph_data_array)
      // const finalCheck = check.slice(1, check.length - 1)
      // console.log(JSON.parse(check))
      socket.send(JSON.stringify(toSend));
    });

    // Listen for messages
    socket.addEventListener("message", event => {
      // console.log("Message from server ", event.data);
      graphData = JSON.parse(event.data);
      // console.log(graphData)
      // Dispatch action with grah data
      dispatch(getGraphData(graphData));
    });
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container} id="positions_tasks_tables">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="positions_tasks_table">
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                    className="lmao"
                    id={toggleCSSState}
                  >
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <span>
        <h6 className="net_Debit_credit_heading">
          Net Debit/Credit: {netDebitCreditState[0] * -1}
        </h6>
      </span>
      <button className="get_graph_button" onClick={sendRiskProfileValues}>
        Risk Profile Graph
      </button>
    </Paper>
  );
}
