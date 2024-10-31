import pandas as pd

# Example DataFrame
df = pd.DataFrame({
    'CRS_DEP_TIME': [1517, 1230, 830, 2235,5]
})

# Convert the time format (HHMM) to HH:MM
df['Readable_DEP_TIME'] = df['CRS_DEP_TIME'].apply(lambda x: f'{int(x // 100):02}:{int(x % 100):02}')

print(df)
