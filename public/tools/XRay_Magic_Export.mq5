//+------------------------------------------------------------------+
//| XRay_Magic_Export.mq5                                            |
//| X-Ray Forensic — EA Magic Number Export Script                   |
//| Run this in MT5 to export trade history with magic numbers       |
//| Find output file in: MT5/MQL5/Files/xray_magic_export.csv       |
//+------------------------------------------------------------------+
#property copyright "X-Ray Forensic"
#property link      "https://xrayforensic.com"
#property version   "1.00"
#property script_show_inputs

input datetime StartDate = D'2024.01.01 00:00:00';
input datetime EndDate   = D'2026.12.31 23:59:59';

void OnStart() {
    if(!HistorySelect(StartDate, EndDate)) {
        Print("ERROR: Could not load history.");
        return;
    }

    int total = HistoryDealsTotal();
    if(total == 0) {
        Print("No deals found in date range.");
        return;
    }

    int handle = FileOpen(
        "xray_magic_export.csv",
        FILE_WRITE|FILE_CSV|FILE_ANSI,
        ','
    );

    if(handle == INVALID_HANDLE) {
        Print("ERROR: Could not create file.");
        return;
    }

    // Header row
    FileWrite(handle,
        "ticket",
        "open_time",
        "close_time",
        "symbol",
        "type",
        "volume",
        "open_price",
        "close_price",
        "sl",
        "tp",
        "profit",
        "commission",
        "swap",
        "magic",
        "comment"
    );

    int written = 0;

    // Match entry/exit deals by position ID
    for(int i = 0; i < total; i++) {
        ulong deal_ticket = HistoryDealGetTicket(i);
        if(deal_ticket == 0) continue;

        long entry_type = HistoryDealGetInteger(
            deal_ticket, DEAL_ENTRY);

        // Only process closing deals
        if(entry_type != DEAL_ENTRY_OUT) continue;

        ulong position_id = HistoryDealGetInteger(
            deal_ticket, DEAL_POSITION_ID);

        // Find the opening deal for this position
        datetime open_time = 0;
        double   open_price = 0;

        for(int j = 0; j < total; j++) {
            ulong open_ticket = HistoryDealGetTicket(j);
            if(open_ticket == 0) continue;
            if(HistoryDealGetInteger(
                open_ticket, DEAL_POSITION_ID)
               != (long)position_id) continue;
            if(HistoryDealGetInteger(
                open_ticket, DEAL_ENTRY)
               != DEAL_ENTRY_IN) continue;

            open_time = (datetime)HistoryDealGetInteger(
                open_ticket, DEAL_TIME);
            open_price = HistoryDealGetDouble(
                open_ticket, DEAL_PRICE);
            break;
        }

        long   magic  = HistoryDealGetInteger(
            deal_ticket, DEAL_MAGIC);
        string symbol = HistoryDealGetString(
            deal_ticket, DEAL_SYMBOL);
        long   dtype  = HistoryDealGetInteger(
            deal_ticket, DEAL_TYPE);

        string deal_type = "buy";
        if(dtype == DEAL_TYPE_SELL)
            deal_type = "sell";

        FileWrite(handle,
            (long)deal_ticket,
            TimeToString(open_time,
                TIME_DATE|TIME_SECONDS),
            TimeToString(
                (datetime)HistoryDealGetInteger(
                    deal_ticket, DEAL_TIME),
                TIME_DATE|TIME_SECONDS),
            symbol,
            deal_type,
            HistoryDealGetDouble(
                deal_ticket, DEAL_VOLUME),
            open_price,
            HistoryDealGetDouble(
                deal_ticket, DEAL_PRICE),
            HistoryDealGetDouble(
                deal_ticket, DEAL_SL),
            HistoryDealGetDouble(
                deal_ticket, DEAL_TP),
            HistoryDealGetDouble(
                deal_ticket, DEAL_PROFIT),
            HistoryDealGetDouble(
                deal_ticket, DEAL_COMMISSION),
            HistoryDealGetDouble(
                deal_ticket, DEAL_SWAP),
            magic,
            HistoryDealGetString(
                deal_ticket, DEAL_COMMENT)
        );

        written++;
    }

    FileClose(handle);

    Print("======================================");
    Print("X-Ray Magic Export Complete");
    Print("Deals exported: ", written);
    Print("File: MT5/MQL5/Files/xray_magic_export.csv");
    Print("Upload this file at xrayforensic.com");
    Print("======================================");

    MessageBox(
        StringFormat(
            "Export complete!\n\n"
            "%d trades exported.\n\n"
            "Find your file at:\n"
            "MT5 → File → Open Data Folder → "
            "MQL5 → Files → xray_magic_export.csv\n\n"
            "Upload it at xrayforensic.com",
            written
        ),
        "X-Ray Export Complete",
        MB_OK|MB_ICONINFORMATION
    );
}
