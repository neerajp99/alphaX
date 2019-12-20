import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getValues } from "../../actions/valuesAction";
import { useDispatch, useSelector } from "react-redux";
const data = require("../utils/data.json");

function createData(
  call_bid,
  call_ask,
  call_volume,
  call_iv,
  call_delta,
  call_gamma,
  call_vega,
  call_theta,
  strike,
  expiry,
  puts_bid,
  puts_ask,
  puts_volume,
  puts_iv,
  puts_delta,
  puts_gamma,
  puts_vega,
  puts_theta
) {
  return {
    call_bid,
    call_ask,
    call_volume,
    call_iv,
    call_delta,
    call_gamma,
    call_vega,
    call_theta,
    strike,
    expiry,
    puts_bid,
    puts_ask,
    puts_volume,
    puts_iv,
    puts_delta,
    puts_gamma,
    puts_vega,
    puts_theta
  };
}

const rows = [];
data.map(d => {
  const call_bid = d["Bid"];
  const call_ask = d["Ask"];
  const call_volume = d["Volume"];
  const call_iv = d["IV"];
  const call_delta = d["Delta"];
  const call_gamma = d["Gamma"];
  const call_vega = d["Vega"];
  const call_theta = d["Theta"];
  const strike = d["Strike"];
  const expiry = d["Expiry"];
  const puts_bid = d["Bid__1"];
  const puts_ask = d["Ask__1"];
  const puts_volume = d["Volume__1"];
  const puts_iv = d["IV__1"];
  const puts_delta = d["Delta__1"];
  const puts_gamma = d["Gamma__1"];
  const puts_vega = d["Vega__1"];
  const puts_theta = d["Theta__1"];

  rows.push({
    call_bid,
    call_ask,
    call_volume,
    call_iv,
    call_delta,
    call_gamma,
    call_vega,
    call_theta,
    strike,
    expiry,
    puts_bid,
    puts_ask,
    puts_volume,
    puts_iv,
    puts_delta,
    puts_gamma,
    puts_vega,
    puts_theta
  });
});

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  {
    id: "name",
    numeric: true,
    disablePadding: true
  },
  { id: "call_bid", numeric: true, disablePadding: false, label: "Call Bid" },
  { id: "call_ask", numeric: true, disablePadding: false, label: "Call Ask" },
  {
    id: "call_volume",
    numeric: true,
    disablePadding: false,
    label: "Call Volume"
  },
  { id: "call_iv", numeric: true, disablePadding: false, label: "Call IV" },
  {
    id: "call_delta",
    numeric: true,
    disablePadding: false,
    label: "Call Delta"
  },
  {
    id: "call_gamma",
    numeric: true,
    disablePadding: false,
    label: "Call Gamma"
  },
  { id: "call_vega", numeric: true, disablePadding: false, label: "Call Vega" },
  {
    id: "call_theta",
    numeric: true,
    disablePadding: false,
    label: "Call Theta"
  },
  { id: "strike", numeric: true, disablePadding: false, label: "Strike" },
  { id: "Expiry", numeric: false, disablePadding: false, label: "Expiry" },
  { id: "puts_bid", numeric: true, disablePadding: false, label: "Puts Bid" },
  { id: "puts_ask", numeric: true, disablePadding: false, label: "Puts Ask" },
  {
    id: "puts_volume",
    numeric: true,
    disablePadding: false,
    label: "Puts Volume"
  },
  { id: "puts_iv", numeric: true, disablePadding: false, label: "Puts IV" },
  {
    id: "puts_delta",
    numeric: true,
    disablePadding: false,
    label: "Puts Delta"
  },
  {
    id: "puts_gamma",
    numeric: true,
    disablePadding: false,
    label: "Puts Gamma"
  },
  { id: "puts_vega", numeric: true, disablePadding: false, label: "Puts Vega" },
  {
    id: "puts_theta",
    numeric: true,
    disablePadding: false,
    label: "Puts Theta"
  }
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));
const options = [];

export const EnhancedTable = () => {
  console.log(rows);
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const optionsState = React.useState([]);
  const values = useSelector(state => state.values);
  const dispatch = useDispatch();

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const onClickSaveValue = (row, value) => {
    console.log(row, value);
    options.push(row);
    optionsState.push(options);
    console.log(values);
    dispatch(getValues(optionsState));
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        align="right"
                        onClick={onClickSaveValue.bind(this, row, "call_bid")}
                      >
                        {row.call_bid}
                      </TableCell>
                      <TableCell
                        align="right"
                        onClick={onClickSaveValue.bind(this, row, "call_ask")}
                      >
                        {row.call_ask}
                      </TableCell>
                      <TableCell align="right">{row.call_volume}</TableCell>
                      <TableCell align="right">{row.call_iv}</TableCell>
                      <TableCell align="right">{row.call_delta}</TableCell>
                      <TableCell align="right">{row.call_gamma}</TableCell>
                      <TableCell align="right">{row.call_vega}</TableCell>
                      <TableCell align="right">{row.call_theta}</TableCell>
                      <TableCell align="right">{row.strike}</TableCell>
                      <TableCell align="right">{row.expiry}</TableCell>
                      <TableCell
                        align="right"
                        onClick={onClickSaveValue.bind(this, row, "puts_bid")}
                      >
                        {row.puts_bid}
                      </TableCell>
                      <TableCell
                        align="right"
                        onClick={onClickSaveValue.bind(
                          this,
                          row,
                          "puts_bid_ask"
                        )}
                      >
                        {row.puts_ask}
                      </TableCell>
                      <TableCell align="right">{row.puts_volume}</TableCell>
                      <TableCell align="right">{row.puts_iv}</TableCell>
                      <TableCell align="right">{row.puts_delta}</TableCell>
                      <TableCell align="right">{row.puts_gamma}</TableCell>
                      <TableCell align="right">{row.puts_vega}</TableCell>
                      <TableCell align="right">{row.puts_theta}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[50, 100, 500]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per head"
        />
      </Paper>
    </div>
  );
};

const mapStateToProps = state => ({
  values: state.values
});
const mapDispatchToProps = { getValues };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EnhancedTable));
