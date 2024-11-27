import {GridRenderEditCellParams} from "@mui/x-data-grid";
import {Autocomplete, Box, TextField} from "@mui/material";

export function AutoCompleteEditCellBuilder(options: string[]) {
    function AutoCompleteEditCell(props: GridRenderEditCellParams<any, any>) {
        const {id, value, field, api} = props;

        function handleChange(newValue: unknown) {
            if (newValue) {
                api.setEditCellValue({
                    id, field, value: newValue
                });
            }
        }

        return (
            <Box sx={{width: '100%', translate: '0 -20px'}}>
                <Autocomplete
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder={value}
                            margin="normal"
                            fullWidth
                        />
                    )}
                    onChange={(_e, v) => {
                        handleChange(v);
                    }}
                    options={options}
                />
            </Box>
        );
    }

    return AutoCompleteEditCell;
}
