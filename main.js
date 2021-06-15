
let pos = 0;

async function maxFee() {

    const response = await fetch('mempool.csv');
    const data = await response.text();

    let mFee = -1,
        local_block_start_index=-1, local_block_end_index=-1,localFee,start=-1,end=-1;


    let memMap = new Map();   // <key,value> = <tx_id,pos>

    const rows = data.split('\n').slice(1);
    // console.log(rows);

    rows.forEach(row => {
        const cols = row.split(',');
        const tx_id = cols[0];
        
        memMap.set(tx_id, pos);   
        pos = pos + 1;

    })

    // console.log(memMap);

    for(let i=0;i<rows.length;i++)
    {
        const cols = rows[i].split(',');
        const tx_id = cols[0];
        const fee = cols[1];
        const weight = cols[2];
        const parent = cols[3];

        let temp = parseInt(fee);  //converting fee to integer

        if(parent != "")  //if the current elements has a parent
        {
            if(memMap.has(parent))  //if the map has its parent then check if its parents position is less than its position
            {
                const position = memMap.get(parent);
                if(position < i)
                {
                    if(local_block_start_index==-1)
                    {
                        local_block_start_index = i;
                        local_block_end_index = i;
                        localFee= temp;
                    }
                    else
                    {    local_block_end_index++;
                         let sum = localFee + fee;
                         localFee = temp;
                    }
                }
                else   //if parents position is greater than its position then we cant include this to our transaction
                {
                    if(localFee > mFee)  //take sum till now 
                    {
                        mFee = localFee;
                        start = local_block_start_index;
                        end = local_block_end_index;

                        local_block_end_index=0;
                        local_block_start_index =0;
                    }
                }
            }
            else{
                // console.log("parent not found");
                start = -1;
                end = -1;
            }
        }
        else
        {
            if(start ==-1)
            {
                start = i;
                end = i;

                mFee = temp;
            }
            else{
                end = i;
                let sum = mFee + temp;
                mFee = sum;
            
            }
        }
        
        
       
    }

    
    console.log(`max fee is ${mFee}`);

    console.log(`starting index is ${start} and ending index is ${end}`);

    console.log("the block is: ");


    for(let i= start;i<=end;i++)
    {
        console.log(rows[i].split(',')[0]);
    }


}

maxFee();
