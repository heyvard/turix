import React, { useState } from "react";
import { UseActivities } from "../queries/useActivities";
import dayjs from "dayjs";
import { Checkbox, Container, FormControlLabel, FormGroup } from "@mui/material";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

export const Langrennsaar = () => {
    const { data: activities } = UseActivities();
    const [valgt, setValgt] = useState(["NordicSki"])

    if (!activities) {
        return null;
    }


    const langrenn = activities.filter((a) => a.type1 == "NordicSki" || a.type1 == "BackcountrySki");
    var aarStart = dayjs("2010-07-01");

    const alletyper = activities.map((a) => a.type1);
    const typer = alletyper.filter((n, i) => alletyper.indexOf(n) === i);


    interface Aar {
        distance: number;
        antall: number;
        aarStart: number;
        aarSlutt: number;
    }

    const aarene = [] as Aar[];
    do {
        const nesteAar = aarStart.add(1, "year");

        const aktiviter = langrenn.filter((a) => {
            let date = dayjs(a.start_date);
            return date.isAfter(aarStart) && date.isBefore(nesteAar);
        });

        const antall = aktiviter.length;
        const sum = aktiviter.map((a) => a.distance).reduce((partialSum, a) => partialSum + a, 0);

        const aaret: Aar = {
            antall,
            distance: sum,
            aarSlutt: nesteAar.year(),
            aarStart: aarStart.year()
        };

        aarene.push(aaret);
        aarStart = nesteAar;
    } while (aarStart.year() < dayjs().year());
    return (
        <>
            {JSON.stringify(valgt)}
            <FormGroup>
                {
                    typer.map((a) => {
                        return <FormControlLabel key={a} control={<Checkbox onChange={(evt)=>{
                            console.log(evt)
                            if(evt.target.checked){
                                console.log(a)
                                const valgte = valgt
                                valgte.push(a)
                                setValgt(valgte)
                            }

                        }
                        } />} label={a} />;
                    })
                }
            </FormGroup>
            <Container maxWidth="md" sx={{ p: 0 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Sesong</TableCell>
                                <TableCell align="right">Distanse</TableCell>
                                <TableCell align="center">Turer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {aarene.reverse().map((row, i) => {
                                return (
                                    <TableRow
                                        key={i}
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 }
                                        }}
                                    >
                                        <TableCell align="center" sx={{ pt: 1, pb: 2 }}>
                                            <Typography>{`${row.aarStart}-${row.aarSlutt}`}</Typography>
                                        </TableCell>
                                        <TableCell align="right" sx={{ pt: 1, pb: 2 }}>
                                            <Typography>{`${(row.distance / 1000).toFixed(2)}km`}</Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ pt: 1, pb: 2 }}>
                                            <Typography>{row.antall}</Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
};
